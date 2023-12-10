import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function startApp() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT);
}

startApp();
