import { useCallback, useState } from "react";
import FilePicker from "@ptolemy2002/react-file-picker";
import { OptionalValueCondition, valueConditionMatches } from "@ptolemy2002/ts-utils";

const supportedTypes: OptionalValueCondition<string> = ["image/png", "image/jpeg", "image/gif"];

function App() {
    const [error, setError] = useState<string | null>(null);

    const fileValidateHandler = useCallback(
        (files: readonly File[]) => {
            if (files.length > 5) {
                setError("You can only upload up to 5 files");
                return false;
            } else if (files.some(file => !valueConditionMatches(file.type, supportedTypes))) {
                setError("Not all files are of supported types");
                return false;
            }

            setError(null);
            return true;
        }, []
    );

    return (
        <>
            <h1>React File Picker</h1>
            <FilePicker
                validateFiles={fileValidateHandler}

                render={({ input, files, urls, modifyInputFiles }) => <>
                    <button onClick={() => input.click()}>Pick Files</button>

                    {
                        !error && <ul>
                            {urls.map(
                                (url, i) => {
                                    const file = files[i];
                                    return (
                                        <li key={url} style={{
                                            display: "flex",
                                            flexDirection: "column"
                                        }}>
                                            {file.name}
                                            <img src={url} alt="preview" style={{maxWidth: "50%"}} />
                                            <button onClick={() => {
                                                modifyInputFiles((files) => {
                                                    files.splice(i, 1);
                                                }, "replace");
                                            }}>Remove</button>
                                        </li>
                                    );
                                }
                            )}
                        </ul>
                    }
                </>}

                defaultChangeBehavior="append"
                accept={supportedTypes}
                multiple
            />

            {error && <p style={{ color: "red" }}>{error}</p>}
        </>
    );
}

export default App
