import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Keyword from './Keyword';

const useStyles = makeStyles((theme) => ({
    header: {
      textAlign: 'center',
    },
    main: {
      textAlign: 'left',
      display: 'inline-block'
    }
}));

export default function MainKeywords(props) {
  const classes = useStyles();

  return (
    <div className={classes.header}>
        <h1>Main Keywords</h1>
        <div className={classes.main}>
          {props.transcriptionResult.keywords.map(keyword => {
              return <Keyword key={keyword} keyword={keyword} timestamps={props.transcriptionResult.words[keyword.split(' ', 1)[0]]} seek={props.seek}/>
            }
          )}     
        </div> 
    </div>
  );
}
