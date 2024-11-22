# React File Picker

This is a library that provides a simple file picker for React applications. It also automatically manages the object URLs for you so you can use them within your application without needing to do that yourself.

## Type Reference
```typescript
import { HTMLProps, ReactNode } from 'react';
type FilePickerRenderFunctionProps = {
    input: HTMLInputElement;
    files: readonly File[];
    urls: readonly string[];
};

type FilePickerProps = {
    inputRef?: React.RefObject<HTMLInputElement>;
    onFilesPicked?: (files: readonly File[], urls: readonly string[]) => void;
    validateFiles?: (files: readonly File[]) => boolean;
    render?: (props: {
        input: HTMLInputElement;
        files: readonly File[];
        urls: readonly string[];
    }) => ReactNode;
} & HTMLProps<HTMLInputElement>
```

## Components
### FilePicker
#### Description
A component that renders a file picker and manages the object URLs for you. It does so using an input elementy, but that is hidden if a `render` function is provided.

#### Props
- `inputRef` (`React.RefObject<HTMLInputElement>`): A ref object that will be used to access the input element. This is useful for when you want to trigger the file picker from outside the rendered component.
- `onFilesPicked` (`(files: readonly File[], urls: readonly string[]) => void`): A function that is called when files are picked. The first argument is an array of the picked files, and the second argument is an array of the object URLs for those files. Note that this will not be called if the files are not valid.
- `validateFiles` (`(files: readonly File[]) => boolean`): A function that is called when files are picked to determine whether the selected files are all valid. This is also the best place to limit the number of files that can be picked and set error messages.
- `render` (`(props: FilePickerRenderFunctionProps) => ReactNode`): A function that is called to render the component. This is useful for when you want to customize the appearance and functionality of the file picker. If unspecified, the appearance and functionality of the default file picker for the browser will be used. The function is passed an object with the following properties:
    - `input` (`HTMLInputElement`): The input element that is used to pick files.
    - `files` (`readonly File[]`): An array of the picked files.
    - `urls` (`readonly string[]`): An array of the object URLs for the picked files.

## Peer Dependencies
- `react^18.3.1`
- `react-dom^18.3.1`

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