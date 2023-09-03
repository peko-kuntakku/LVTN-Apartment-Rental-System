import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Color } from '../../styles/GlobalStyles';

export function not(a: readonly any[], b: readonly any[]) {
    return a.filter((value) => b.indexOf(value) === -1);
}

export function intersection(a: readonly any[], b: readonly any[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: readonly any[], b: readonly any[]) {
    return [...a, ...not(b, a)];
}

interface TransferListProps {
    leftData: any[],
    rightData: any[],
    onSelect: (value: any[]) => void,
}

export default function TransferList({ leftData, rightData, onSelect }: TransferListProps) {
    const [checked, setChecked] = React.useState<readonly any[]>([]);
    const [left, setLeft] = React.useState<readonly any[]>(leftData ? leftData : []);
    const [right, setRight] = React.useState<readonly any[]>(rightData ? rightData : []);

    React.useEffect(() => {
        leftData && setLeft(leftData)
    }, [leftData])

    React.useEffect(() => {
        rightData && setRight(rightData)
    }, [rightData])

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value: any) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    // UPDATE PARENT'S SELECTED APARTMENTS
    React.useEffect(() => {
        onSelect(intersection([...checked], right));
    }, [checked])

    const numberOfChecked = (items: readonly any[]) =>
        intersection(checked, items).length;

    const handleToggleAll = (items: readonly any[]) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const customList = (title: React.ReactNode, items: readonly any[]) => (
        <Card sx={{ boxShadow: 'none', border: `1px solid ${Color.border}` }}>
            <CardHeader
                sx={{ px: 2, py: 1 }}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={
                            numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} đã chọn`}
            />
            <Divider />
            <List
                sx={{
                    width: '100%',
                    height: 230,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                {items.map((value: any) => {
                    const labelId = `transfer-list-all-item-${value.id}-label`;

                    return (
                        <ListItem
                            key={value.id}
                            role="listitem"
                            button
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`Căn hộ ${value.name}`} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Card>
    );

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid xs={5} item>{customList('Lựa chọn', left)}</Grid>
            <Grid xs={2} item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Grid>
            </Grid>
            <Grid xs={5} item>{customList('Đã chọn', right)}</Grid>
        </Grid>
    );
}
