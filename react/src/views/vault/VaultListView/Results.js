import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles,
  Button,
} from '@material-ui/core';
import {
  Trash as TrashIcon,
  Edit as EditIcon,
  HardDrive as HardDriveIcon,
  Download as DownloadIcon,
} from 'react-feather';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  if (!bytes) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  return `${Math.round((bytes / 1024 ** i) * 10, 2) / 10} ${sizes[i]}`;
}

const Results = ({ className, customers, ...rest }) => {
  const classes = useStyles();
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = customers.map((customer) => customer.id);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table style={{ overflowX: 'scroll' }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.length === customers.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0
                      && selectedCustomerIds.length < customers.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Quick Actions
                </TableCell>
                <TableCell>
                  Date Upload
                </TableCell>
                <TableCell>
                  Size
                </TableCell>
                <TableCell>
                  Type
                </TableCell>
                <TableCell>
                  Owner
                </TableCell>
                <TableCell>
                  Tags
                </TableCell>
                <TableCell>
                  Visibility
                </TableCell>
                <TableCell>
                  Views
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.slice(0, limit).map((file) => (
                <TableRow
                  hover
                  key={file.id}
                  selected={selectedCustomerIds.indexOf(file.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.indexOf(file.id) !== -1}
                      onChange={(event) => handleSelectOne(event, file.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      alignItems="center"
                      display="flex"
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {file.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell width={306}>
                    <Button
                      color="primary"
                      variant="contained"
                      style={{ height: 36, marginRight: 6 }}
                    >
                      <HardDriveIcon size={16} />
                    </Button>
                    <Button
                      color="primary"
                      variant="contained"
                      style={{ height: 36, marginRight: 6 }}
                    >
                      <DownloadIcon size={16} />
                    </Button>
                    <Button
                      color="primary"
                      variant="contained"
                      style={{ height: 36, marginRight: 6 }}
                    >
                      <EditIcon size={16} />
                    </Button>
                    <Button
                      color="primary"
                      variant="contained"
                      style={{ height: 36 }}
                    >
                      <TrashIcon size={16} />
                    </Button>
                  </TableCell>
                  <TableCell>
                    {moment(file.createdAt).format('DD/MM/YYYY HH:mm')}
                  </TableCell>
                  <TableCell>
                    {bytesToSize(file.size)}
                  </TableCell>
                  <TableCell>
                    {file.type}
                  </TableCell>
                  <TableCell>
                    {file.owner.username}
                  </TableCell>
                  <TableCell>
                    {(file.tags || []).join(', ')}
                  </TableCell>
                  <TableCell>
                    {file.visibility}
                  </TableCell>
                  <TableCell>
                    {file.views}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={customers.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  customers: PropTypes.array.isRequired
};

export default Results;
