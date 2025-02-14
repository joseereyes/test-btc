import { body, validationResult } from "express-validator"
import { Request, Response, NextFunction } from 'express';


const registerUser = () => {
    return [
        body('fullName').isString().withMessage("El nombre completo es obligatorio."),
        body('email').isEmail().withMessage("El correo es obligatorio."),
        body('password').isString().withMessage("La clave es obligatoria."), // La contraseña es opcional en este esquema
        validation
    ]
}

const validateLogin = () => {
    return [
        body('username').isString().withMessage("El nombre de usuario es obligatorio."),
        body('password').isString().withMessage("La clave es obligatoria."),
        validation
    ]
}

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


export {
    registerUser,
    validateLogin
}