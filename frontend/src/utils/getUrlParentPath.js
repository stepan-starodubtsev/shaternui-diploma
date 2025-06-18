const getUrlParentPath = (rounds, pathname) => {
    const segments = pathname.split('/').filter(Boolean);
    for (let i = 0; i < rounds; i++) {
        segments.pop();
    }

    return '/' + segments.join('/');
}

export default getUrlParentPath;