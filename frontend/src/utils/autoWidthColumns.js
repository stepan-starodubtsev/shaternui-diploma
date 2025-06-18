export function autoWidthColumns(columns, font = '14px Source Code Pro') {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;

    return columns.map((col) => {
        const label = col.headerName || col.field;
        const textWidth = context.measureText(label).width;

        const autoWidth = Math.ceil(textWidth + 20);

        return {
            ...col,
            flex: col.flex ?? undefined,
            width: col.flex ? undefined : autoWidth,
        };
    });
}