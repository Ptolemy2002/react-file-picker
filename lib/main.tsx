import { HTMLProps, ReactNode, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useUnmountEffect } from "@ptolemy2002/react-mount-effects";
import { OptionalValueCondition, Override, valueConditionMatches } from "@ptolemy2002/ts-utils";
import { extensions } from "mime-types";

export const AllMimeTypes: readonly string[] = Object.keys(extensions);

export interface FilePickerRenderFunctionProps {
    input: HTMLInputElement;
    files: readonly File[];
    urls: readonly string[];
}

export type FilePickerProps = Override<
    HTMLProps<HTMLInputElement>, {
        inputRef?: React.RefObject<HTMLInputElement>;
        onFilesPicked?: (files: readonly File[], urls: readonly string[]) => void;
        validateFiles?: (files: readonly File[]) => boolean;
        render?: (props: FilePickerRenderFunctionProps) => ReactNode;
        generateURLs?: boolean;
        debug?: boolean;
        accept?: OptionalValueCondition<string>
    }
>;

export default function FilePicker({
    inputRef: _inputRef,
    onFilesPicked,
    validateFiles = () => true,
    render,
    generateURLs = true,
    onChange: onInputChange,
    onClick: onInputClick,
    debug=false,
    accept,
    ...props
}: FilePickerProps) {
    const [files, setFiles] = useState<File[]>([]);
    const urlsRef = useRef<string[]>([]);
    const [, setInitialized] = useState(false);

    const inputRef = useRef<HTMLInputElement | null>(null);
    useImperativeHandle(_inputRef, () => inputRef.current!);

    const revokeURLs = useCallback(() => {
        urlsRef.current.forEach((url) => {
            if (debug) console.log("Revoking file URL:", url);
            URL.revokeObjectURL(url)
        });
        urlsRef.current = [];
    }, [debug]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const _files = [...Array.from(e.target.files ?? [])];
        if (debug) {
            console.log("Selected files:", _files);
            console.log("File list equality check:", _files === files);
        }

        if (generateURLs) {
            revokeURLs();
            urlsRef.current = _files.map(file => URL.createObjectURL(file));
            if (debug) console.log("Generated file URLs:", urlsRef.current);
        }

        if (validateFiles(_files)) {
            if (debug) console.log("Files are valid");
            onFilesPicked?.(_files, urlsRef.current);
        } else {
            if (debug) console.log("Files are invalid");
        }

        setFiles(_files);
    }, [debug, files, generateURLs, onFilesPicked, validateFiles, revokeURLs]);

    useEffect(() => {
        setInitialized(true);
    }, []);

    useUnmountEffect(revokeURLs);

    const acceptList = useMemo(() => {
        if (accept === undefined) return accept;
        return AllMimeTypes.filter((mime) => valueConditionMatches(mime, accept));
    }, [accept]);

    if (debug) console.log("Rendering FilePicker", files, urlsRef.current);
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
                    if (debug) console.log("Resetting file input value on click");
                    e.currentTarget.value = "";
                    onInputClick?.(e);
                }}

                accept={acceptList?.join(",")}
            />

            {inputRef.current && render?.({
                input: inputRef.current,
                files,
                urls: urlsRef.current
            })}
        </>
    );
}