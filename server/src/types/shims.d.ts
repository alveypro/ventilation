declare module 'cors' {
  import type { RequestHandler } from 'express'
  interface CorsOptions {
    origin?: boolean | string | RegExp | Array<string | RegExp>
    methods?: string | string[]
    allowedHeaders?: string | string[]
    exposedHeaders?: string | string[]
    credentials?: boolean
    maxAge?: number
    preflightContinue?: boolean
    optionsSuccessStatus?: number
  }
  type CorsFactory = (options?: CorsOptions) => RequestHandler
  const cors: CorsFactory
  export default cors
}

declare module 'multer' {
  import type { RequestHandler } from 'express'

  interface MulterFile {
    originalname: string
    filename: string
    path: string
  }

  interface DiskStorageOptions {
    destination: (
      req: unknown,
      file: MulterFile,
      cb: (error: Error | null, destination: string) => void
    ) => void
    filename: (
      req: unknown,
      file: MulterFile,
      cb: (error: Error | null, filename: string) => void
    ) => void
  }

  interface MulterInstance {
    single(fieldName: string): RequestHandler
  }

  interface MulterFactory {
    (options?: { storage?: unknown; limits?: { fileSize?: number } }): MulterInstance
    diskStorage(options: DiskStorageOptions): unknown
  }

  const multer: MulterFactory
  export default multer
}

declare module 'pdf-parse' {
  function pdfParse(input: Buffer | Uint8Array): Promise<{ text?: string }>
  export default pdfParse
}

declare module 'mammoth' {
  const mammoth: {
    extractRawText(input: { path: string }): Promise<{ value?: string }>
  }
  export default mammoth
}

declare module 'tesseract.js' {
  function createWorker(options?: unknown): Promise<unknown>
  export { createWorker }
}

declare namespace Express {
  interface Request {
    file?: {
      originalname: string
      filename: string
      path: string
    }
  }
}
