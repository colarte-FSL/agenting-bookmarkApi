// runs before any module is imported, so config picks up :memory:
process.env.DB_PATH = ':memory:';
process.env.PORT = '3999';
