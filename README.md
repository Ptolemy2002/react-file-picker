# React File Picker

This is a library that provides a simple file picker for React applications. It also automatically manages the object URLs for you so you can use them within your application without needing to do that yourself (can be disabled).

## Important Note
The `mime-types` package depends on `process.platform`, which isn't avaiable on vite by default. This is the solution to that problem:
```typescript
import { defineConfig } from 'vite';

export default defineConfig({
    // Other config options...
    define: {
        "process.platform": JSON.stringify(process.platform)
    }
});
```

## Type Reference
```typescript
import { HTMLProps, ReactNode } from 'react';
import { OptionalValueCondition, Override } from "@ptolemy2002/ts-utils";

type FilePickerChangeBehavior = "replace" | "append";

interface FilePickerRenderFunctionProps {
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

type FilePickerProps = Override<
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
```

## Values
### AllMimeTypes
**Type**: `readonly string[]`
Using the `mime-types` package, this is a list of all the MIME types that are recognized.

## Components
### FilePicker
#### Description
A component that renders a file picker and manages the object URLs for you. It does so using an input elementy, but that is hidden if a `render` function is provided.

#### Props
- `inputRef` (`React.RefObject<HTMLInputElement>`): A ref object that will be used to access the input element. This is useful for when you want to trigger the file picker from outside the rendered component.
- `onFilesPicked` (`(files: readonly File[], urls: readonly string[]) => void`): A function that is called when files are picked. The first argument is an array of the picked files, and the second argument is an array of the object URLs for those files. Note that this will not be called if the files are not valid.
- `validateFiles` (`(files: readonly File[]) => boolean`): A function that is called when files are picked to determine whether the selected files are all valid. This is also the best place to limit the number of files that can be picked and set error messages. By default, this function always returns `true`.
- `accept` (`OptionalValueCondition<string>`): A string that specifies the types of files that the file input should accept. It is an `OptionalValueCondition` that will be tested against the global list of MIME types. If unspecified, the file input will accept all files. IMPORTANT: The `accepts` attribute is only a hint to the browser and does not actually restrict the types of files that could theoretically be picked. Thus, this property does not remove the need to validate the file type in the `validateFiles` function.
- `render` (`(props: FilePickerRenderFunctionProps) => ReactNode`): A function that is called to render the component. This is useful for when you want to customize the appearance and functionality of the file picker. If unspecified, the appearance and functionality of the default file picker for the browser will be used. The function is passed an object with the following properties:
    - `input` (`HTMLInputElement`): The input element that is used to pick files.
    - `files` (`readonly File[]`): An array of the picked files.
    - `urls` (`readonly string[]`): An array of the object URLs for the picked files.
    - `modifyInputFiles` (`function`): A function that can be called to directly modify the files that the input field has selected. It takes the following arguments:
        - `transformer` (`(files: File[]) => File[] | undefined | void`): A function that takes the current files and returns the new files. If `undefined` is returned, the input list will be used, allowing you to mutate it instead of returning a new list.
        - `changeBehavior` (`FilePickerChangeBehavior`): A string that determines the behavior when modifying the files. If set to `append`, the new files will be added to the existing list rather than replacing them. By default, this is set to `replace`.
        - `options` (`object`): An object that can be used to override the default behavior of the function. It has the following properties:
            - `dispatch` (`object`): An object that determines whether the change and input events should be dispatched. It has the following properties:
                - `change` (`boolean`): A boolean that determines whether the change event should be dispatched. By default, this is set to `true`.
                - `changeOptions` (`EventInit`): An object that determines the options for the change event. By default, this is set to `{bubbles: true}`.
                - `input` (`boolean`): A boolean that determines whether the input event should be dispatched. By default, this is set to `true`.
                - `inputOptions` (`EventInit`): An object that determines the options for the input event. By default, this is set to `{bubbles: true}`.
- `generateURLs` (`boolean`): A boolean that determines whether object URLs should be generated for the picked files. If set to `false`, the `urls` array will always be empty. This is useful for when you want to manage the object URLs yourself or have an alternative way of displaying the files. By default, this is set to `true`.
- `defaultChangeBehavior` (`FilePickerChangeBehavior`): A string that determines the default behavior when modifying the files. If set to `append`, the new files will be added to the existing list rather than replacing them. You can override within `modifyInputFiles`. By default, this is set to `replace`.
- `debug` (`boolean`): A boolean that determines whether debug messages should be logged to the console. By default, this is set to `false`.

## Peer Dependencies
- `react^18.3.1`
- `react-dom^18.3.1`
- `@ptolemy2002/react-mount-effects^2.0.0`
- `@ptolemy2002/ts-utils^3.0.0`
- `mime-types^2.1.35`

## Commands
The following commands exist in the project:

- `npm run build` - Builds the library
- `npm run dev` - Starts the development server
- `npm run lint` - Lints the project
- `npm run uninstall` - Uninstalls all dependencies for the library and clears the cache
- `npm run reinstall` - Uninstalls, clears the cache, and then reinstalls all dependencies for the library
- `npm run release` - Publishes the library to npm without changing the version
- `npm run release-patch` - Publishes the library to npm with a patch version bump
- `npm run release-minor` - Publishes the library to npm with a minor version bump
- `npm run release-major` - Publishes the library to npm with a major version bump