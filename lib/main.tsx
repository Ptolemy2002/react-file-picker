import { HTMLProps, ReactNode, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

export interface FilePickerRenderFunctionProps {
    input: HTMLInputElement;
    files: readonly File[];
    urls: readonly string[];
}

export type FilePickerProps = {
    inputRef?: React.RefObject<HTMLInputElement>;
    onFilesPicked?: (files: readonly File[], urls: readonly string[]) => void;
    validateFiles?: (files: readonly File[]) => boolean;
    render?: (props: FilePickerRenderFunctionProps) => ReactNode;
    generateURLs?: boolean;
    debug?: boolean;
} & HTMLProps<HTMLInputElement>;

export default function FilePicker({
    inputRef: _inputRef,
    onFilesPicked,
    validateFiles = () => true,
    render,
    generateURLs = true,
    onChange: onInputChange,
    onClick: onInputClick,
    debug=false,
    ...props
}: FilePickerProps) {
    const [files, setFiles] = useState<File[]>([]);
    const urlsRef = useRef<string[]>([]);

    const inputRef = useRef<HTMLInputElement | null>(null);
    useImperativeHandle(_inputRef, () => inputRef.current!);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const _files = Array.from(e.target.files ?? []);
        if (debug) console.log("Selected files:", _files);
        setFiles(_files);
    }, [debug]);

    // Create a list of ObjectURLs for the files
    useEffect(() => {
        if (validateFiles(files)) {
            if (debug) console.log("Files are valid");
            onFilesPicked?.(files, urlsRef.current);
        } else {
            if (debug) console.log("Files are invalid");
        }

        if (generateURLs) {
            urlsRef.current = files.map(file => URL.createObjectURL(file));
            if (debug) console.log("Generated URLs:", urlsRef.current);
        }

        // This will run not just when the component unmounts, but also before every re-render
        // with changes to the `files` state
        return () => {
            urlsRef.current.forEach((url) => {
                if (debug) console.log("Revoking URL:", url);
                URL.revokeObjectURL(url)
            });
            urlsRef.current = [];
        };
    }, [files, generateURLs, onFilesPicked, validateFiles, debug]);

    return (
        <>
            <input
                {...props}
                ref={inputRef}
                type="file"
                style={
                    // Hide the input element, if we will render a custom one
                    render && { display: "none" }
                }
                onChange={e => {
                    handleChange(e);
                    onInputChange?.(e);
                }}

                onClick={e => {
                    // Reset on every click, so that the same file can be selected again
                    // and the `onChange` event will fire still
                    if (debug) console.log("Resetting input value on click");
                    e.currentTarget.value = "";
                    onInputClick?.(e);
                }}
            />

            {inputRef.current && render?.({
                input: inputRef.current,
                files,
                urls: urlsRef.current
            })}
        </>
    );
}