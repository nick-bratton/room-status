# room-status

Shows the availability status of an office room. Features a close-up view and a far-away view, which are toggled with a proximity sensor.

This project uses Microsoft Active Directory for the room information and pubnub for subscribing to the proximity information.

## Configuration

For development, copy `.env.example` to `.env` and fill it up accordingly.

For production, set these variables in your running environment.

## Project setup

```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
