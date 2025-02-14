import { HTMLProps, ReactNode, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useUnmountEffect } from "@ptolemy2002/react-mount-effects";
import { OptionalValueCondition, Override, valueConditionMatches } from "@ptolemy2002/ts-utils";
import { extensions } from "mime-types";

export const AllMimeTypes: readonly string[] = Object.keys(extensions);

export type FilePickerChangeBehavior = "replace" | "append";

export interface FilePickerRenderFunctionProps {
    input: HTMLInputElement;
    files: readonly File[];
    urls: readonly string[];
    modifyInputFiles: (
        transformer: (files: File[]) => File[] | undefined | void,
        changeBehavior?: FilePickerChangeBehavior,
        options?: {
            dispatch?: {
                change?: boolean;
                changeOptions?: EventInit;
                input?: boolean;
                inputOptions?: EventInit;
            }
        }
    ) => File[];
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
        defaultChangeBehavior?: FilePickerChangeBehavior;
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
    defaultChangeBehavior="replace",
    ...props
}: FilePickerProps) {
    const [files, setFiles] = useState<File[]>([]);
    const urlsRef = useRef<string[]>([]);
    const [, setInitialized] = useState(false);
    const changeBehaviorRef = useRef<FilePickerChangeBehavior>(defaultChangeBehavior);

    const inputRef = useRef<HTMLInputElement | null>(null);
    useImperativeHandle(_inputRef, () => inputRef.current!);

    const revokeURLs = useCallback(() => {
        urlsRef.current.forEach((url) => {
            if (debug) console.log("Revoking file URL:", url);
            URL.revokeObjectURL(url)
        });
        urlsRef.current = [];
    }, [debug]);

    const modifyInputFiles = useCallback<FilePickerRenderFunctionProps["modifyInputFiles"]>(
        (
            transformer, changeBehavior="replace",
            {
                dispatch: {
                    change: dispatchChange=true,
                    changeOptions={
                        bubbles: true
                    },

                    input: dispatchInput=true,
                    inputOptions={
                        bubbles: true
                    }
                }={}
            }={}
        ) => {
            // Directly modify the input element's files
            // and dispatch the change and input events
            // so we can keep everything in sync

            const input = inputRef.current!;
            const newFiles = transformer(files) ?? files;

            const dataTransfer = new DataTransfer();
            if (changeBehavior === "append") {
                files.forEach(file => dataTransfer.items.add(file));
            }
            newFiles.forEach(file => dataTransfer.items.add(file));

            // Set change behavior for the next handleChange call. We already modified the files
            // according to the current behavior, so we don't need that done again
            changeBehaviorRef.current = "replace";
            input.files = dataTransfer.files;
            if (dispatchChange) input.dispatchEvent(new Event("change", changeOptions));
            if (dispatchInput) input.dispatchEvent(new Event("input", inputOptions));

            return newFiles;
        }, [files]
    );

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let _files: File[] = Array.from(e.target.files ?? []);

        if (debug) console.log("Selected files:", _files);
        
        if (changeBehaviorRef.current === "append") {
            if (debug) console.log("Appending new files to existing files");
            _files = [...files, ..._files];
        }

        if (generateURLs) {
            revokeURLs();
            urlsRef.current = _files.map(file => URL.createObjectURL(file));
            if (debug) console.log("Generated file URLs:", urlsRef.current);
        } else {
            urlsRef.current = [];
        }

        if (validateFiles(_files)) {
            if (debug) console.log("Files are valid");
            onFilesPicked?.(_files, urlsRef.current);
        } else {
            if (debug) console.log("Files are invalid");
        }

        // Reset change behavior to default
        changeBehaviorRef.current = defaultChangeBehavior;
        setFiles(_files);
    }, [debug, files, generateURLs, onFilesPicked, validateFiles, revokeURLs, defaultChangeBehavior]);

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
                urls: urlsRef.current,
                modifyInputFiles
            })}
        </>
    );
}