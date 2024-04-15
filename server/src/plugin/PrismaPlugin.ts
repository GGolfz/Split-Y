import { PrismaClient } from "@prisma/client";
import Elysia from "elysia";

const PrismaPlugin = new Elysia().decorate("prismaClient", new PrismaClient());

export default PrismaPlugin;