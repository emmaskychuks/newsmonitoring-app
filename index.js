const cron = require('node-cron');
const app = require('./server/server');
const fetchAllNewsForAllClients = require('./cron/fetchClientNews');
const cors = require('cors');

app.use(cors());

`
* * * * * *
| | | | | |
| | | | | day of week
| | | | month
| | | day of month
| | hour
| minute
second ( optional )
`

// Schedule tasks to be run on the server.
cron.schedule(`*/${process.env.CRON_MINUTES_INTERVAL} * * * *`, function() {
    fetchAllNewsForAllClients();
    console.log('[Cron Job] Starting client news update...');
});

app.listen(process.env.CRON || 3000);
