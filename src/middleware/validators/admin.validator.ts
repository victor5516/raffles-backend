import { NextFunction, Request, Response } from "express";
import { checkSchema, validationResult, Schema } from "express-validator";
import { ApiError } from "../error.middleware";

const adminLoginSchema: Schema = {
    email: {
        in: ["body"],
        isEmail: true,
        errorMessage: "El email es requerido",
    },
    password: {
        in: ["body"],
        isString: true,
        isLength: {
            options: { min: 6 }
        },
        errorMessage: "La contraseña es requerida y debe tener al menos 6 caracteres",
    },
};

export const adminLoginValidator = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    await checkSchema(adminLoginSchema).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next(new ApiError(400, errors.array() as any));
    }

    next();
};