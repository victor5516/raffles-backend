import { NextFunction, Request, Response } from "express";
import { checkSchema, validationResult, Schema } from "express-validator";
import { ApiError } from "../error.middleware";
import { RaffleStatus } from "@prisma/client";

const raffleSchema: Schema = {
    title: {
        in: ["body"],
        isString: true,
        errorMessage: "El titulo es requerido",
    },
    description: {
        in: ["body"],
        isString: true,
        optional: true,
    },
    digits_length: {
        in: ["body"],
        isInt: true,
        errorMessage: "La longitud de los digitos es requerida",
    },
    ticket_price: {
        in: ["body"],
        isFloat: {
            options: {
                min: 0
            }
        },
        errorMessage: "El precio del ticket es requerido",
    },
    total_tickets: {
        in: ["body"],
        isInt: true,
        errorMessage: "El total de tickets es requerido",
    },
    deadline: {
        in: ["body"],
        isISO8601: true,
        errorMessage: "La fecha de cierre es requerida",
    },
    status: {
        in: ["body"],
        isIn: {
            options: [Object.values(RaffleStatus)]
        },
        optional: true,
    },
}

const updateRaffleSchema: Schema = {
    title: {
        in: ["body"],
        isString: true,
        optional: true,
    },
    description: {
        in: ["body"],
        isString: true,
        optional: true,
    },
    digits_length: {
        in: ["body"],
        isInt: true,
        optional: true,
    },
    ticket_price: {
        in: ["body"],
        isFloat: {
            options: {
                min: 0
            }
        },
        optional: false,
    },
    total_tickets: {
        in: ["body"],
        isInt: true,
        optional: false,
    },
    image_url: {
        in: ["body"],
        isURL: true,
        optional: true,
    },
    deadline: {
        in: ["body"],
        isISO8601: true,
        optional: true,
    },
    status: {
        in: ["body"],
        isIn: {
            options: [Object.values(RaffleStatus)]
        },
        optional: true,
    },
}

export const createRaffleValidator = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    await checkSchema(raffleSchema).run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // @ts-ignore
        return next(new ApiError(400, errors.array()));
    }
    next();
}

export const updateRaffleValidator = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    await checkSchema(updateRaffleSchema).run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // @ts-ignore
        return next(new ApiError(400, errors.array()));
    }
    next();
}