export const headerStyles = {
    wrapper: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: '10px',
        height: '125px', 
    },
    topRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'end',
        alignItems: 'center',
        marginBottom: '5px',
        '& > *': {
            marginRight: '10px',
        },
    },
    middleRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', 
        marginBottom: '5px',
        width: '100%',
    },
    rightActions: {
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        right: '20px',
    },
    title: {
        textAlign: 'center',
        fontSize: '2.5rem',
    },
    link: {
        fontWeight: 250,
        color: 'black', 
        "&:hover": {
            color: '#f0f0f0',
            cursor: 'pointer',
        },
    },
    userProfileButton: {
        '& .MuiIconButton-root': {
            transform: 'scale(2)', 
            marginRight: '25px',
            marginTop: '25px',

        }
    },
};