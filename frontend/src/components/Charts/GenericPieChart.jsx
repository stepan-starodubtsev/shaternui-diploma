import React from 'react';
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import {Paper, Typography} from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF', '#FF4560', '#775DD0'];

const GenericPieChart = ({ title, data, dataKey = "value", nameKey = "name" }) => {
    if (!data || data.length === 0) {
        return (
            <Paper elevation={3} sx={{ p: 2, height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="subtitle1">Немає даних для відображення: {title}</Typography>
            </Paper>
        );
    }

    return (
        <Paper elevation={3} sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom align="center">
                {title}
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey={dataKey}
                        nameKey={nameKey}
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </Paper>
    );
};

export default GenericPieChart;