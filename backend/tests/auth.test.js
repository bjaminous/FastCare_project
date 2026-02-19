/**
 * Tests unitaires — Authentification (register / login)
 */

// ── Mocks ────────────────────────────────────────────────────────────────────
const mockUser = {
    id: 1,
    nom: "Jean Dupont",
    email: "jean@test.com",
    motDePasse: "$2a$10$hashedpassword",
    age: 25,
    poidsInitial: 75.5,
    dateInscription: "2026-02-13",
    comparePassword: jest.fn(),
};

const mockUserWithoutPassword = { ...mockUser };
delete mockUserWithoutPassword.motDePasse;
delete mockUserWithoutPassword.comparePassword;

jest.mock("../src/models", () => ({
    User: {
        scope: jest.fn().mockReturnThis(),
        findOne: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
    },
}));

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn().mockReturnValue("mock_jwt_token"),
}));

const { User } = require("../src/models");
const { register, login } = require("../src/controllers/auth.controller");

// ── Helpers ──────────────────────────────────────────────────────────────────
function createRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

// ── Tests Register ───────────────────────────────────────────────────────────
describe("Auth Controller — register", () => {
    afterEach(() => jest.clearAllMocks());

    test("201 — inscription réussie avec données valides", async () => {
        const req = {
            body: { nom: "Jean Dupont", email: "jean@test.com", motDePasse: "secret123", age: 25 },
        };
        const res = createRes();

        User.scope.mockReturnThis();
        User.findOne.mockResolvedValue(null); // email libre
        User.create.mockResolvedValue(mockUser);
        User.findByPk.mockResolvedValue(mockUserWithoutPassword);

        await register(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: true, token: "mock_jwt_token", user: expect.any(Object) })
        );
    });

    test("400 — email déjà utilisé", async () => {
        const req = {
            body: { nom: "Jean", email: "jean@test.com", motDePasse: "secret123", age: 25 },
        };
        const res = createRes();

        User.scope.mockReturnThis();
        User.findOne.mockResolvedValue(mockUser);

        await register(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: false, message: "Cet email est déjà utilisé" })
        );
    });

    test("400 — données invalides (nom trop court)", async () => {
        const req = { body: { nom: "J", email: "jean@test.com", motDePasse: "secret123" } };
        const res = createRes();

        await register(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: false, errors: expect.any(Array) })
        );
    });

    test("400 — données invalides (email manquant)", async () => {
        const req = { body: { nom: "Jean", motDePasse: "secret123" } };
        const res = createRes();

        await register(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(400);
    });
});

// ── Tests Login ──────────────────────────────────────────────────────────────
describe("Auth Controller — login", () => {
    afterEach(() => jest.clearAllMocks());

    test("200 — connexion réussie", async () => {
        const req = { body: { email: "jean@test.com", motDePasse: "secret123" } };
        const res = createRes();

        const userWithCompare = { ...mockUser, comparePassword: jest.fn().mockResolvedValue(true) };
        User.scope.mockReturnThis();
        User.findOne.mockResolvedValue(userWithCompare);
        User.findByPk.mockResolvedValue(mockUserWithoutPassword);

        await login(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: true, token: "mock_jwt_token" })
        );
    });

    test("401 — mot de passe incorrect", async () => {
        const req = { body: { email: "jean@test.com", motDePasse: "wrong" } };
        const res = createRes();

        const userWithCompare = { ...mockUser, comparePassword: jest.fn().mockResolvedValue(false) };
        User.scope.mockReturnThis();
        User.findOne.mockResolvedValue(userWithCompare);

        await login(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(401);
    });

    test("401 — email non trouvé", async () => {
        const req = { body: { email: "inconnu@test.com", motDePasse: "secret123" } };
        const res = createRes();

        User.scope.mockReturnThis();
        User.findOne.mockResolvedValue(null);

        await login(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(401);
    });

    test("400 — email et mot de passe manquants", async () => {
        const req = { body: {} };
        const res = createRes();

        await login(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(400);
    });
});
