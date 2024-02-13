import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

type BigIntWithSerializer = {
  toJSON: () => string
} & typeof globalThis.BigInt.prototype

(globalThis.BigInt.prototype as BigIntWithSerializer).toJSON = function() {       
  return this.toString()
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma