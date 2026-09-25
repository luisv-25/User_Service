import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    await app.listen(process.env.PORT || 3000);

    console.log(`Application running on port ${process.env.PORT || 3000}`);
  } catch (error) {
    console.error("BOOTSTRAP ERROR:", error);
    console.error("BOOTSTRAP ERROR JSON:", JSON.stringify(error, null, 2));
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error("UNHANDLED BOOTSTRAP ERROR:", error);
  console.error("UNHANDLED BOOTSTRAP ERROR JSON:", JSON.stringify(error, null, 2));
  process.exit(1);
});
