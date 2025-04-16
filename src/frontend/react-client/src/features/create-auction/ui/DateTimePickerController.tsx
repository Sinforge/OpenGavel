import {Controller} from "react-hook-form";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

interface Props {
    name: string;
    label: string;
}
export const DateTimePickerController : React.FC<Props> = ({ name, label }) => (
        <Controller
            name={name}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <DateTimePicker
                    label={label}
                    value={value}
                    onChange={onChange}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            margin: 'normal',
                            error: !!error,
                            helperText: error?.message,
                        },
                    }}
                />
            )}
        />);