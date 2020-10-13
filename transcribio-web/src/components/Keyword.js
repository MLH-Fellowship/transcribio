import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    keyword: {
        fontSize: '18px'
    },
    timestamp: {
        padding: '5px',
        background: 'none',
        border: 'none',
        color: '#3F51B5',
        cursor: 'pointer',
        fontSize: '18px'
      }
}));

function secondsToTime(seconds){
    var h = Math.floor(seconds / 3600).toString().padStart(2,'0'),
        m = Math.floor(seconds % 3600 / 60).toString().padStart(2,'0'),
        s = Math.floor(seconds % 60).toString().padStart(2,'0');
    
    return h + ':' + m + ':' + s;
}

export default function Keyword(props) {
    const classes = useStyles();
  
    return (
        <div>
          <span className={classes.keyword}>{props.keyword + " - "}</span>
          {props.timestamps.map(timestamp =>
                <span key={timestamp.start_time}>
                    <button className={classes.timestamp} onClick={() => props.seek(parseInt(timestamp.start_time))}>
                        {secondsToTime(timestamp.start_time)}
                    </button>
                    {" | "}
                </span>
            )}
        </div>
    );
}
