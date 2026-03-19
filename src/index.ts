import app from './app';
import { config } from './config';
import { runMigrations } from './repositories/migrate';

runMigrations();

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
