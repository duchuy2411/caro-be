import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '36ch',
        backgroundColor: theme.palette.background.paper,
        maxHeight: 500,
        overflow: 'auto'
    },
    inline: {
        color: 'deepskyblue',
    }
}));

function MessagesList({ source ,record = {} }) {
    const classes = useStyles();

    function renderList() {
        if (!record[source])  return;
        return record[source].map(el => {
            return (
                <React.Fragment>
                    <ListItem alignItems="flex-start">
                        <ListItemText
                            primary={
                                <Typography style={{
                                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 50%)',
                                    border: 0,
                                    borderRadius: 3,
                                    color: 'white',
                                    padding: '0 5px',
                                    marginBottom: '5px',
                                }}>
                                    {el.fromUsername}
                                </Typography>
                            }
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        {el.content}
                                    </Typography>
                                    <Typography>
                                        {new Date(el.time).toLocaleString()}
                                    </Typography>
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                </React.Fragment>
            )
        });
    }

    return (
        <React.Fragment>
            <Typography style={{
                marginTop: '20px',
                color: '#bdbdbd'
            }}>Nội dung cuộc trò chuyện</Typography>
            <List className={classes.root}>
                {renderList()}
            </List>
        </React.Fragment>
    );
}

MessagesList.propTypes = {
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

MessagesList.defaultProps = {
    label: 'Cuộc trò chuyện'
};

export default MessagesList;