// needed file para di ma boang ang typescript when importing css
declare module '*.css' {
    const content: any;
    export default content;
}