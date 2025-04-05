import {Controller} from "react-hook-form";
import {TextField} from "@mui/material";
import React from "react";

interface Props {
    name: string;
    label: string;
    type: string
}

export const TextFieldController : React.FC<Props> = ({name, label, type}) =>
    <Controller
        name={name}
        render={({ field, fieldState }) => (
            <TextField
                {...field}
                fullWidth
                required
                label={label}
                hiddenLabel={true}
                margin="normal"
                type={type}
                rows={1}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
            />
        )}
    />;

