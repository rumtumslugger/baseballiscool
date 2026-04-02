import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "/src/components/ui/card";


const fantasyTeams = [
  {
    name: "ItsHowYouPlayTheGame",
    teams: ["Yankees", "Brewers", "Cubs",  "Rays", "Guardians", "Rockies"],
  },
  {
    name: "Carol",
    teams: ["Dodgers", "Phillies", "Cubs",  "Reds", "Giants", "Nationals"],
  },
  {
    name: "All Rise",
    teams: ["Dodgers", "Cubs", "Brewers",  "Guardians", "Reds", "Rockies"],
  },
  {
    name: "NECB",
    teams: ["Dodgers", "Phillies", "Tigers",  "Royals", "Reds", "Nationals"],
  },
  {
    name: "Boston Tea Party",
    teams: ["Dodgers", "Phillies", "Tigers",  "Padres", "Reds", "Nationals"],
  },
  {
    name: "Beffballs",
    teams: ["Mariners", "Braves", "Padres",  "Giants", "Rays", "Nationals"],
  },
  {
    name: "Never Order Helmet Nachos",
    teams: ["Yankees", "Tigers", "Guardians",  "Royals", "Cardinals", "Rockies"],
  },
  {
    name: "The Good Team",
    teams: ["Mariners", "Cubs", "Diamondbacks",  "Angels", "Pirates", "White Sox"],
  },
  {
    name: "Woody Harrelson\'s Hash Pipe",
    teams: ["Yankees", "Red Sox", "Orioles",  "Rangers", "Pirates", "White Sox"],
  },
  {
    name: "Pitch Don’t Kill My Vibe",
    teams: ["Mets", "Braves", "Brewers",  "Giants", "Pirates", "Cardinals"],
  },
  {
    name: "wildxbaseball10",
    teams: ["Yankees", "Red Sox", "Orioles",  "Astros", "Pirates", "Marlins"],
  },
  {
    name: "Tom's Team",
    teams: ["Braves", "Orioles", "Astros",  "Rangers", "Twins", "Angels"],
  },
  {
    name: "Beak Freak",
    teams: ["Blue Jays", "Orioles", "Rays",  "Angels", "Cardinals", "Rockies"],
  },
  {
    name: "Jobu Needs a Refill",
    teams: ["Blue Jays", "Phillies", "Royals",  "Padres", "Athletics", "Marlins"],
  },  {
    name: "Relief Pitchers 🍺",
    teams: ["Mets", "Tigers", "Padres",  "Giants", "Athletics", "Twins"],
  },
  {
    name: "Ryan S",
    teams: ["Mariners", "Red Sox", "Astros",  "Rangers", "Athletics", "Twins"],
  },
  {
    name: "bulldogs",
    teams: ["Mets", "Braves", "Diamondbacks",  "White Sox", "Angels", "Marlins"],
  },
  {
    name: "Nice Boyz in the Outfield",
    teams: ["Brewers", "Red Sox", "Diamondbacks",  "Guardians", "White Sox", "Twins"],
  },
  {
    name: "Rum Tum Slugger",
    teams: ["Blue Jays", "Royals", "Diamondbacks", "Marlins", "Cardinals", "Mets"],
  },
  {
    name: "The Robo ump is my dad",
    teams: ["Mariners", "Blue Jays", "Astros",  "Rangers", "Athletics", "Rays"],
  },


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
        const res = await fetch("https://statsapi.mlb.com/api/v1/teams/stats?season=2026&stats=season&group=hitting&sortStat=stolenBases&sportIds=1");
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
