import { body, check, validationResult,query, param } from "express-validator"
import { Request, Response, NextFunction } from 'express';

const validation = (req: Request, res: Response, next: NextFunction) => {
    const errors: any[] = validationResult(req).array();

    if (errors.length === 0) {
        return next();
    }

    const errorMessage = errors[0].msg;

    return res.status(422).json({
        success: false,
        data: null,
        message: errorMessage
    });
};


const validateDevice = () => {
    return [
        body("type")
            .isIn(["light", "sensor", "switch"])
            .withMessage("El tipo debe ser 'light', 'sensor' o 'switch'"),

        body("data.state")
            .isIn(["on", "off"])
            .withMessage("El estado debe ser 'on' o 'off'"),

        body("data.attributes.friendlyName")
            .isString()
            .withMessage("El nombre debe ser un texto"),

        body("data.attributes.brightness")
            .optional()
            .isInt({ min: 0, max: 250 }).toInt()
            .withMessage("El brillo debe ser un número entre 0 y 250"),

        body("data.attributes.ledColor")
            .optional()
            .isString()
            .withMessage("El color del LED debe ser un texto"),

        body("data.attributes.unitOfMeasurement")
            .optional()
            .isIn(["CELSIUS", "FARENHEIT"])
            .withMessage("La unidad de medida debe ser 'CELSIUS' o 'FARENHEIT'"),
        validation
    ]
}

const updateDevice = () => {
    return [
        param("_id").isInt().toInt().withMessage("El id debe ser un numero"),
        body("type")
            .isIn(["light", "sensor", "switch"])
            .withMessage("El tipo debe ser 'light', 'sensor' o 'switch'"),

        body("data.state")
            .isIn(["on", "off"])
            .withMessage("El estado debe ser 'on' o 'off'"),

        body("data.attributes.friendlyName")
            .isString()
            .withMessage("El nombre debe ser un texto"),

        body("data.attributes.brightness")
            .optional()
            .isInt({ min: 0, max: 250 }).toInt()
            .withMessage("El brillo debe ser un número entre 0 y 250"),

        body("data.attributes.ledColor")
            .optional()
            .isString()
            .withMessage("El color del LED debe ser un texto"),

        body("data.attributes.unitOfMeasurement")
            .optional()
            .isIn(["CELSIUS", "FARENHEIT"])
            .withMessage("La unidad de medida debe ser 'CELSIUS' o 'FARENHEIT'"),
        validation
    ]
}

const deleteDevice = () => {
    return [
        param("_id").isInt().toInt().withMessage("El id debe ser un numero")
    ]
}


const getDeviceQuery = () => {
    return [
        
        query("page")
        .isInt({ min: 1 }).toInt().withMessage("La pagina debe ser un número mayor a 0, ejemplo : page=1"),

        query("limit")
        .isInt({ min: 10, max: 100 }).toInt().withMessage("El limite por pagina debe ser un número entre 10 y 100, ejemplo: limit=10"),

        query("state").optional()
        .isIn(["on", "off"]).withMessage("El estado debe ser 'on' o 'off', ejemplo: state=on"),

        query("friendlyName").optional().isString().withMessage("El nombre debe ser un texto, ejemplo: friendlyName=Led"),

        validation
    ]
}


export { validateDevice,getDeviceQuery,updateDevice,deleteDevice }