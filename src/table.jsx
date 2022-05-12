import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2, 0),
  },
  table: {
    minWidth: 650,
  },
}));

export default function Listing(props) {
  const classes = useStyles();
  var data = props.data;
  const { button } = props;

  if (data.length === 0) {
    return <div></div>;
  }

  function parse(data) {
    try {
      var url = new URL(data);
      return (
        <a href={data} target="_blank" rel="noreferrer">
          {data}
        </a>
      );
    } catch (err) {
      const email =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      if (email.test(data)) return <a href={`mailto:${data}`}> {data}</a>;
      return data;
    }
  }

  var keys = Object.keys(data[0]);
  keys = keys.filter((key) => key != "id");

  return (
    <TableContainer className={classes.root} component={Paper}>
      <Table className={classes.table} id="tableStyle" aria-label="simple table">
        <TableHead>
          <TableRow>
            {keys.map((key) => (
              <TableCell className="bold" key={key}>
                {key}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => {
            return (
              <TableRow key={item.id}>
                {keys.map((key) => (
                  <TableCell key={key} align="left">
                    {parse(item[key])}
                  </TableCell>
                ))}
                {button && (
                  <TableCell key={item.id} align="left">
                    <Button
                      onClick={(e) => button.onClick(e, item.id)}
                      variant="contained"
                      color="primary"
                    >
                      {button.text}
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
