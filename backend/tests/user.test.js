/**
 * Tests unitaires — Profil utilisateur (getMe / updateProfile)
 */

jest.mock("../src/models", () => ({
    User: {
        findByPk: jest.fn(),
    },
}));

const { User } = require("../src/models");
const { getMe, updateProfile } = require("../src/controllers/user.controller");

// ── Helpers ──────────────────────────────────────────────────────────────────
function createRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

// ── Tests getMe ──────────────────────────────────────────────────────────────
describe("User Controller — getMe", () => {
    afterEach(() => jest.clearAllMocks());

    test("200 — retourne le profil sans motDePasse", async () => {
        const mockProfile = { id: 1, nom: "Jean", email: "jean@test.com", age: 25 };
        User.findByPk.mockResolvedValue(mockProfile);

        const req = { user: { id: 1 } };
        const res = createRes();

        await getMe(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: true, user: mockProfile })
        );
        // Vérifier que motDePasse n'est pas présent
        const returnedUser = res.json.mock.calls[0][0].user;
        expect(returnedUser).not.toHaveProperty("motDePasse");
    });

    test("404 — utilisateur non trouvé", async () => {
        User.findByPk.mockResolvedValue(null);

        const req = { user: { id: 999 } };
        const res = createRes();

        await getMe(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(404);
    });
});

// ── Tests updateProfile ──────────────────────────────────────────────────────
describe("User Controller — updateProfile", () => {
    afterEach(() => jest.clearAllMocks());

    test("200 — mise à jour réussie", async () => {
        const mockUserInstance = {
            id: 1,
            nom: "Jean",
            age: 25,
            update: jest.fn().mockResolvedValue(true),
        };
        const updatedProfile = { id: 1, nom: "Jean-Pierre", age: 30, email: "jean@test.com" };

        User.findByPk
            .mockResolvedValueOnce(mockUserInstance)  // premier appel : trouver l'utilisateur
            .mockResolvedValueOnce(updatedProfile);    // deuxième appel : retourner le profil mis à jour

        const req = { user: { id: 1 }, body: { nom: "Jean-Pierre", age: 30 } };
        const res = createRes();

        await updateProfile(req, res, jest.fn());

        expect(mockUserInstance.update).toHaveBeenCalledWith({ nom: "Jean-Pierre", age: 30 });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: true, user: updatedProfile })
        );
    });

    test("400 — données invalides (âge < 10)", async () => {
        const req = { user: { id: 1 }, body: { age: 5 } };
        const res = createRes();

        await updateProfile(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test("404 — utilisateur non trouvé", async () => {
        User.findByPk.mockResolvedValue(null);

        const req = { user: { id: 999 }, body: { nom: "Nouveau" } };
        const res = createRes();

        await updateProfile(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(404);
    });
});
