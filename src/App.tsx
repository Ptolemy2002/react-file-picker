import { useCallback, useState } from "react";
import FilePicker from "@ptolemy2002/react-file-picker";

const supportedTypes = ["image/png", "image/jpeg", "image/gif"];

function App() {
    const [urls, setUrls] = useState<readonly string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const filePickHandler = useCallback(
        (files: readonly File[], urls: readonly string[]) => setUrls(urls), []
    );

    const fileValidateHandler = useCallback(
        (files: readonly File[]) => {
            if (files.length > 5) {
                setError("You can only upload up to 5 files");
                return false;
            } else if (files.some(file => !supportedTypes.includes(file.type))) {
                setError("Not all files are images");
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
              onFilesPicked={filePickHandler}
              validateFiles={fileValidateHandler}

              render={({ input, files }) => <>
                  <button onClick={() => input.click()}>Pick Files</button>
                  <ul>
                      {files.map((file, i) => <li key={i}>{file.name}</li>)}
                  </ul>
              </>}

              multiple
          />

          {error && <p style={{ color: "red" }}>{error}</p>}
          {!error && urls.map((url, i) => <img key={i} src={url} alt="preview" style={{maxWidth: "50%"}} />)}
      </>
    );
}

export default App
