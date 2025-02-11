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

type FilePickerRenderFunctionProps = {
    input: HTMLInputElement;
    files: readonly File[];
    urls: readonly string[];
};

type FilePickerProps = Override<
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
- `accept` (`OptionalValueCondition<string>`): A string that specifies the types of files that the file input should accept. It is an `OptionalValueCondition` that will be tested against the global list of MIME types. If unspecified, the file input will accept all files.
- `render` (`(props: FilePickerRenderFunctionProps) => ReactNode`): A function that is called to render the component. This is useful for when you want to customize the appearance and functionality of the file picker. If unspecified, the appearance and functionality of the default file picker for the browser will be used. The function is passed an object with the following properties:
    - `input` (`HTMLInputElement`): The input element that is used to pick files.
    - `files` (`readonly File[]`): An array of the picked files.
    - `urls` (`readonly string[]`): An array of the object URLs for the picked files.
- `generateURLs` (`boolean`): A boolean that determines whether object URLs should be generated for the picked files. If set to `false`, the `urls` array will always be empty. This is useful for when you want to manage the object URLs yourself or have an alternative way of displaying the files. By default, this is set to `true`.

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