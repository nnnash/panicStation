const teams = [
    {name: 'Nina', color: 'blue'},
    {name: 'Billy jr.', color: 'red'},
    {name: 'Doc', color: 'white'},
    {name: 'Raven', color: 'yellow'},
    {name: 'Jason', color: 'green'},
    {name: 'Ramirez', color: 'purple'},
];

const makeTeam = (team, ind) => ({
    ...team,
    id: ind,
    person: {
        health: 4,
    },
    droid: {
        health: 4,
    },
});

module.exports = teams.map(makeTeam);
