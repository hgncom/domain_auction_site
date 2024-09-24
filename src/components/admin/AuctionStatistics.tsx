import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AuctionStatisticsProps {
  statistics: any;
  handleExportData: (dataType: 'domains' | 'users' | 'bids') => void;
}

const AuctionStatistics: React.FC<AuctionStatisticsProps> = ({ statistics, handleExportData }) => {
  if (!statistics) return <div>Loading statistics...</div>;

  const { totalBids, averageBid, highestBid, mostActiveDomain, mostActiveUser } = statistics;

  const chartData = [
    { name: 'Average Bid', value: averageBid },
    { name: 'Highest Bid', value: highestBid },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Auction Statistics</h2>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalBids}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Bid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${averageBid.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Highest Bid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${highestBid.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Most Active Domain</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{mostActiveDomain}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most Active User</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{mostActiveUser}</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-bold mb-2">Bid Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Bid Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-4">
        <Button onClick={() => handleExportData('bids')}>Export Bid Data</Button>
      </div>
    </div>
  );
};

export default AuctionStatistics;