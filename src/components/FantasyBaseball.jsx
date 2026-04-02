import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "/src/components/ui/card";

const fantasyTeams = [
  {
    name: "Tom's Team",
    teams: ["Los Angeles Dodgers", "Texas Rangers", "Boston Red Sox", "Kansas City Royals", "Detroit Tigers", "Chicago White Sox"],
  },
  {
    name: "All Rise ",
    teams: ["Los Angeles Dodgers", "San Diego Padres", "Arizona Diamondbacks", "Tampa Bay Rays", "Toronto Blue Jays", "Chicago White Sox"],
  },
  {
    name: "Nice Boyz @ Bat",
    teams: ["New York Yankees", "Arizona Diamondbacks", "Texas Rangers", "Athletics", "Tampa Bay Rays", "Chicago White Sox"],
  },
  {
    name: "Rum Tum Slugger",
    teams: ["New York Mets", "Cleveland Guardians", "Chicago Cubs", "Milwaukee Brewers", "Cincinnati Reds", "Colorado Rockies"],
  },
  {
    name: "Cole Story, Bro",
    teams: ["Los Angeles Dodgers", "Arizona Diamondbacks", "Chicago Cubs", "Detroit Tigers", "Milwaukee Brewers", "Colorado Rockies"],
  },
  {
    name: "The Robo ump is my dad",
    teams: ["New York Mets", "Boston Red Sox", "Texas Rangers", "Kansas City Royals", "Tampa Bay Rays", "Miami Marlins"],
  },
  {
    name: "Never Order Helmet Nachos",
    teams: ["Los Angeles Dodgers", "Cleveland Guardians", "San Diego Padres", "Detroit Tigers", "Cincinnati Reds", "Miami Marlins"],
  },
  {
    name: "wildxbaseball10",
    teams: ["Atlanta Braves", "Houston Astros", "Texas Rangers", "San Francisco Giants", "Cincinnati Reds", "Miami Marlins"],
  },
  {
    name: "Carol",
    teams: ["Atlanta Braves", "Houston Astros", "Minnesota Twins", "Kansas City Royals", "Tampa Bay Rays", "Washington Nationals"],
  },
  {
    name: "Beak Freak",
    teams: ["Baltimore Orioles", "St. Louis Cardinals", "Toronto Blue Jays", "Los Angeles Angels", "Colorado Rockies", "Chicago White Sox"],
  },
  {
    name: "Beffballs",
    teams: ["New York Yankees", "San Diego Padres", "Chicago Cubs", "Detroit Tigers", "San Francisco Giants", "Washington Nationals"],
  },
  {
    name: "New Jersey Baseball Team",
    teams: ["New York Yankees", "Baltimore Orioles", "Toronto Blue Jays", "Cincinnati Reds", "Colorado Rockies", "Miami Marlins"],
  },
  {
    name: "Relief Pitchers 🍺",
    teams: ["New York Mets", "Boston Red Sox", "San Diego Padres", "Seattle Mariners", "San Francisco Giants", "Los Angeles Angels"],
  },
  {
    name: "Ryan S",
    teams: ["Atlanta Braves", "Philadelphia Phillies", "Minnesota Twins", "Seattle Mariners", "San Francisco Giants", "Los Angeles Angels"],
  },  {
    name: "Jobu Needs a Refill",
    teams: ["Philadelphia Phillies", "Baltimore Orioles", "Cleveland Guardians", "Kansas City Royals", "Washington Nationals", "Pittsburgh Pirates"],
  },
  {
    name: "Boston Tea Party",
    teams: ["Philadelphia Phillies", "Arizona Diamondbacks", "Seattle Mariners", "Milwaukee Brewers", "Athletics", "Pittsburgh Pirates"],
  },
  {
    name: "Woody Harrelson's Hash Pipe",
    teams: ["Houston Astros", "Boston Red Sox", "Cleveland Guardians", "Minnesota Twins", "St. Louis Cardinals", "Pittsburgh Pirates"],
  },
  {
    name: "bulldogs",
    teams: ["New York Yankees", "Houston Astros", "St. Louis Cardinals", "Toronto Blue Jays", "Athletics", "Los Angeles Angels"],
  },
  {
    name: "NECB",
    teams: ["Philadelphia Phillies", "Baltimore Orioles", "Milwaukee Brewers", "Chicago Cubs", "Athletics", "Washington Nationals"],
  },
  {
    name: "The Good Team",
    teams: ["New York Mets", "Atlanta Braves", "Minnesota Twins", "Seattle Mariners", "St. Louis Cardinals", "Pittsburgh Pirates"],
  },

  // Add the rest of your fantasy teams here...
];

export default function FantasyBaseball() {
  const [standings, setStandings] = useState([]);
  const [standingsAL, setStandingsAL] = useState([]);
  const [teamStats, setTeamStats] = useState([]);
  const [displayStats, setDisplayStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Wins/Losses
  useEffect(() => {
    async function fetchStandings() {
      try {
        const res1 = await fetch("https://statsapi.mlb.com/api/v1/standings?leagueId=103");
        const data1 = await res1.json();
        const teams1 = data1.records.flatMap(record => record.teamRecords);

        const res2 = await fetch("https://statsapi.mlb.com/api/v1/standings?leagueId=104");
        const data2 = await res2.json();
        const teams2 = data2.records.flatMap(record => record.teamRecords);

        setStandings(teams1);
        setStandingsAL(teams2);
      } catch (err) {
        console.error("Error fetching standings:", err);
      }
    }
    fetchStandings();
  }, []);

  // Fetch Home Runs & Stolen Bases
  useEffect(() => {
    async function fetchTeamStats() {
      try {
        const res = await fetch("https://statsapi.mlb.com/api/v1/teams/stats?season=2025&stats=season&group=hitting&sortStat=stolenBases&sportIds=1");
        const data = await res.json();
        
        console.log("Team Stats API Response:", data); // Debugging line
  
        const stats = data.stats?.[0]?.splits?.map(team => ({
          name: team.team.name,
          homeRuns: team.stat?.homeRuns ?? 0,
          stolenBases: team.stat?.stolenBases ?? 0,
        })) || [];
  
        console.log("Parsed Team Stats:", stats); // Check if stats are correctly parsed
  
        setTeamStats(stats);
      } catch (err) {
        console.error("Error fetching team stats:", err);
      }
    }
    fetchTeamStats();
  }, []);

  // Process Fantasy Team Stats
  useEffect(() => {
    if (!standings.length || !standingsAL.length || !teamStats.length) return;

    const combinedStandings = [...standings, ...standingsAL];

    const fantasyStats = fantasyTeams.map((fantasyTeam) => {
      const teamData = fantasyTeam.teams.map((teamName) => {
        const standingsData = combinedStandings.find((team) => team.team.name === teamName) || {};
        const statsData = teamStats.find((team) => team.name === teamName) || {};

        return {
          wins: standingsData.wins || 0,
          losses: standingsData.losses || 0,
          homeRuns: statsData.homeRuns || 0,
          stolenBases: statsData.stolenBases || 0,
        };
      });

      return {
        name: fantasyTeam.name,
        wins: teamData.reduce((sum, t) => sum + t.wins, 0),
        losses: teamData.reduce((sum, t) => sum + t.losses, 0),
        homeRuns: teamData.reduce((sum, t) => sum + t.homeRuns, 0),
        stolenBases: teamData.reduce((sum, t) => sum + t.stolenBases, 0),
        winPct: ((teamData.reduce((sum, t) => sum + t.wins, 0) /
          (teamData.reduce((sum, t) => sum + t.wins + t.losses, 0) || 1)) ).toFixed(5) ,
      };
    });

    setDisplayStats(fantasyStats.sort((a, b) => parseFloat(b.winPct) - parseFloat(a.winPct)));
    setLoading(false);
  }, [standings, standingsAL, teamStats]);

  if (loading) return <div className="p-4 text-xl">Loading...</div>;

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-screen-large">
        <CardContent className="p-4">
          <table className="w-full table-auto border border-collapse mx-auto">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left">Fantasy Team</th>
                <th className="border px-4 py-2 text-left">Total Wins</th>
                <th className="border px-4 py-2 text-left">Total Losses</th>
                <th className="border px-4 py-2 text-left">Win %</th>
                <th className="border px-4 py-2 text-left">Home Runs</th>
                <th className="border px-4 py-2 text-left">Stolen Bases</th>
              </tr>
            </thead>
            <tbody>
              {displayStats.map((row, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">{row.name}</td>
                  <td className="border px-4 py-2">{row.wins}</td>
                  <td className="border px-4 py-2">{row.losses}</td>
                  <td className="border px-4 py-2">{row.winPct}</td>
                  <td className="border px-4 py-2">{row.homeRuns}</td>
                  <td className="border px-4 py-2">{row.stolenBases}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
