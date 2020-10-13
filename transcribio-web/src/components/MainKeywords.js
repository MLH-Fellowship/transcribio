import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';

const useStyles = makeStyles((theme) => ({
    main: {
        textAlign: 'center'
    }
}));

export default function MainKeywords(props) {
  const classes = useStyles();

  return (
      <div className={classes.main}>
          <h1>Main Keywords</h1>
      </div>
  );
}
