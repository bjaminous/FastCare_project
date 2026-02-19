/**
 * Tests unitaires — Middleware d'authentification
 */
const jwt = require("jsonwebtoken");
const authMiddleware = require("../src/middlewares/auth.middleware");

// ── Helpers ──────────────────────────────────────────────────────────────────
function createRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe("Auth Middleware", () => {
    const originalEnv = process.env.JWT_SECRET;

    beforeAll(() => {
        process.env.JWT_SECRET = "test_secret_key";
    });

    afterAll(() => {
        process.env.JWT_SECRET = originalEnv;
    });

    test("401 — aucun token fourni", () => {
        const req = { headers: {} };
        const res = createRes();
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: false, message: expect.stringContaining("Token manquant") })
        );
        expect(next).not.toHaveBeenCalled();
    });

    test("401 — header Authorization sans 'Bearer'", () => {
        const req = { headers: { authorization: "InvalidFormat" } };
        const res = createRes();
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    test("403 — token invalide", () => {
        const req = { headers: { authorization: "Bearer invalid_token_xyz" } };
        const res = createRes();
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: false, message: expect.stringContaining("invalide") })
        );
        expect(next).not.toHaveBeenCalled();
    });

    test("403 — token expiré", () => {
        // Créer un token expiré
        const expiredToken = jwt.sign(
            { id: 1, email: "test@test.com" },
            process.env.JWT_SECRET,
            { expiresIn: "0s" }
        );

        const req = { headers: { authorization: `Bearer ${expiredToken}` } };
        const res = createRes();
        const next = jest.fn();

        // Petit délai pour que le token soit bien expiré
        setTimeout(() => {
            authMiddleware(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(next).not.toHaveBeenCalled();
        }, 100);
    });

    test("200 — token valide, req.user est défini", () => {
        const validToken = jwt.sign(
            { id: 42, email: "user@test.com" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const req = { headers: { authorization: `Bearer ${validToken}` } };
        const res = createRes();
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user).toBeDefined();
        expect(req.user.id).toBe(42);
        expect(req.user.email).toBe("user@test.com");
    });
});
