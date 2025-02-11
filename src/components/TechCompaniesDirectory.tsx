import { useState, useEffect } from 'react';
import Papa from 'papaparse';
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Card from '@mui/material/Card';
import { CardHeader, CardContent, Input, MenuItem, CardActionArea } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const TechCompaniesDirectory = () => {
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadData = async () => {
            const response = await fetch("data.csv");
            const csvText = await response.text();
            const result = Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true
            });

            const techKeywords = [
                'software', 'tech', 'digital', 'it ', 'consulting', 'technology', 'cyber',
                'data', 'cloud', 'solutions', 'systems', 'ai', 'artificial intelligence',
                'computing', 'semiconductor', 'electronics', 'telecom'
            ];

            const techCompanies = result.data
                .filter(row => {
                    const name = row['Organisation Name'].toLowerCase();
                    return techKeywords.some(keyword => name.includes(keyword));
                })
                .map(company => ({
                    name: company['Organisation Name'],
                    city: company['Town/City'].toUpperCase() === 'LONDON' ? 'London' : company['Town/City'] || 'Unknown',
                    county: company['County'] || 'Unknown',
                    route: company['Route']
                }));

            // Get unique non-empty cities and normalize London
            const uniqueCities = [...new Set(techCompanies
                .map(company => company.city)
                .filter(city => city && city.trim() !== ''))]
                .sort((a, b) => a.localeCompare(b));

            setCompanies(techCompanies);
            setFilteredCompanies(techCompanies);
            setCities(uniqueCities);
        };

        loadData();
    }, []);

    useEffect(() => {
        let filtered = companies;

        if (selectedCity !== 'all') {
            filtered = filtered.filter(company => company.city === selectedCity);
        }

        if (searchTerm) {
            filtered = filtered.filter(company =>
                company.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredCompanies(filtered);
    }, [selectedCity, searchTerm, companies]);
    const handleChange = (event: SelectChangeEvent) => {
        setSelectedCity(event.target.value as string);
    };
    return (
        <Card>
            <CardHeader>
                <h1>Tech Companies Directory ({filteredCompanies.length} companies)</h1>

            </CardHeader>
            <CardActionArea>
                <div >
                    <div >
                        <Select value={selectedCity} onChange={handleChange}>
                            <MenuItem value="all">All Cities</MenuItem>
                            {cities.map(city => (
                                <MenuItem key={city} value={city}>{city}</MenuItem>
                            ))}
                        </Select>
                    </div>
                    <Input
                        placeholder="Search companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </CardActionArea>
            <CardContent>
                <div className="h-96 overflow-auto">
                    <table className="w-full">
                        <thead className="sticky top-0 bg-white">
                            <tr>
                                <th className="text-left p-2 border-b">Company Name</th>
                                <th className="text-left p-2 border-b">City</th>
                                <th className="text-left p-2 border-b">County</th>
                                <th className="text-left p-2 border-b">Visa Route</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCompanies.map((company, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="p-2 border-b">{company.name}</td>
                                    <td className="p-2 border-b">{company.city}</td>
                                    <td className="p-2 border-b">{company.county}</td>
                                    <td className="p-2 border-b">{company.route}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export default TechCompaniesDirectory;