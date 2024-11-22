import { HTMLProps, ReactNode, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

export type FilePickerRenderFunctionProps = {
    input: HTMLInputElement;
    files: readonly File[];
    urls: readonly string[];
};

export type FilePickerProps = {
    inputRef?: React.RefObject<HTMLInputElement>;
    onFilesPicked?: (files: readonly File[], urls: readonly string[]) => void;
    validateFiles?: (files: readonly File[]) => boolean;
    render?: (props: FilePickerRenderFunctionProps) => ReactNode;
} & HTMLProps<HTMLInputElement>;

export default function FilePicker({
    inputRef: _inputRef,
    onFilesPicked,
    validateFiles = () => true,
    render,
    onChange: onInputChange,
    ...props
}: FilePickerProps) {
    const [files, setFiles] = useState<File[]>([]);
    const urlsRef = useRef<string[]>([]);

    const inputRef = useRef<HTMLInputElement | null>(null);
    useImperativeHandle(_inputRef, () => inputRef.current!);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const _files = Array.from(e.target.files ?? []);

        setFiles(_files);
    }, [onFilesPicked, validateFiles]);

    // Create a list of ObjectURLs for the files
    useEffect(() => {
        urlsRef.current.forEach(URL.revokeObjectURL);
        urlsRef.current = files.map(file => URL.createObjectURL(file));
        if (validateFiles(files)) onFilesPicked?.(files, urlsRef.current);

        return () => {
            urlsRef.current.forEach(URL.revokeObjectURL);
        };
    }, [files]);

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
            />

            {inputRef.current && render && render({
                input: inputRef.current,
                files,
                urls: urlsRef.current
            })}
        </>
    );
}