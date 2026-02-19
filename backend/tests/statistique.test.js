/**
 * Tests unitaires — Statistiques utilisateur (permissions & accès)
 */

jest.mock("../src/models", () => ({
    Statistique: {
        findAll: jest.fn(),
    },
}));

const { Statistique } = require("../src/models");
const { getUserStats } = require("../src/controllers/statistique.controller");

// ── Helpers ──────────────────────────────────────────────────────────────────
function createRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe("Statistique Controller — getUserStats", () => {
    afterEach(() => jest.clearAllMocks());

    test("200 — retourne les statistiques de l'utilisateur", async () => {
        const mockStats = [
            { id: 1, dureeTotaleJeune: 48, nombreJeunes: 3, variationPoids: -1.5, utilisateur_id: 1 },
        ];
        Statistique.findAll.mockResolvedValue(mockStats);

        const req = { user: { id: 1 } };
        const res = createRes();

        await getUserStats(req, res, jest.fn());

        expect(Statistique.findAll).toHaveBeenCalledWith({ where: { utilisateur_id: 1 } });
        expect(res.status).toHaveBeenCalledWith(200);

        const body = res.json.mock.calls[0][0];
        expect(body.success).toBe(true);
        expect(body.totalStatistiques).toBe(1);
        expect(body.moyenne).toBeDefined();
        expect(body.progression).toBeDefined();
        expect(body.historique).toHaveLength(1);
    });

    test("404 — aucune statistique trouvée", async () => {
        Statistique.findAll.mockResolvedValue([]);

        const req = { user: { id: 1 } };
        const res = createRes();

        await getUserStats(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: false, message: expect.stringContaining("Aucune statistique") })
        );
    });

    test("Filtre correctement par utilisateur_id (sécurité)", async () => {
        Statistique.findAll.mockResolvedValue([]);

        const req = { user: { id: 42 } };
        const res = createRes();

        await getUserStats(req, res, jest.fn());

        // Vérifie que le filtre utilise bien l'ID de l'utilisateur connecté
        expect(Statistique.findAll).toHaveBeenCalledWith({ where: { utilisateur_id: 42 } });
    });

    test("Calculs agrégés corrects avec plusieurs entrées", async () => {
        const mockStats = [
            { id: 1, dureeTotaleJeune: 24, nombreJeunes: 2, variationPoids: -0.5, utilisateur_id: 1 },
            { id: 2, dureeTotaleJeune: 48, nombreJeunes: 4, variationPoids: -1.5, utilisateur_id: 1 },
        ];
        Statistique.findAll.mockResolvedValue(mockStats);

        const req = { user: { id: 1 } };
        const res = createRes();

        await getUserStats(req, res, jest.fn());

        const body = res.json.mock.calls[0][0];
        expect(body.totalStatistiques).toBe(2);
        expect(body.progression.dureeTotale).toBe(72);
        expect(body.progression.nombreTotalJeunes).toBe(6);
        expect(body.progression.variationPoidsGlobale).toBe(-2);
        expect(body.moyenne.dureeMoyenne).toBe(36);
        expect(body.moyenne.jeunesMoyen).toBe(3);
    });

    test("Gère les erreurs serveur", async () => {
        Statistique.findAll.mockRejectedValue(new Error("DB Error"));

        const req = { user: { id: 1 } };
        const res = createRes();
        const next = jest.fn();

        await getUserStats(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
});
