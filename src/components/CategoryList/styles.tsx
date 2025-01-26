export const CategoryStyles = {
    drawer: {
        width: 360,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
            width: 360,
            boxSizing: 'border-box',
            backgroundColor: '#FFFFFF',
            color: 'black',
        },
        '& .Mui-selected': {
            color: 'black',
        },
    },
    title: {
        padding: '16px',
        fontWeight: 'bold',
        fontSize: '28px',
        textAlign: 'center',
        color: '#000',
        fontFamily: '"Arial", "Helvetica", sans-serif',
    },
    icons: {
        color: 'black!important',
        marginLeft: '20px',
    },
    text: {
        '& span': {
            marginLeft: '-12px',
            fontWeight: '600',
            fontSize: '18px',
            color: 'black',
            fontFamily: '"Arial", "Helvetica", sans-serif',
        },
    },
};
