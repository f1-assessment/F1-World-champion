import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'F1 World Champions API',
    version: '1.0.0',
    description: 'API for Formula 1 race data, championships, drivers, and constructors',
    contact: {
      name: 'F1 Champions Team',
      email: 'contact@f1champions.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:5001',
      description: 'Development server'
    }
  ],
  tags: [
    {
      name: 'Races',
      description: 'Race data operations'
    },
    {
      name: 'Seasons',
      description: 'F1 season information'
    },
    {
      name: 'Lap Data',
      description: 'Lap timing data operations'
    },
    {
      name: 'Pit Stops',
      description: 'Pit stop data operations'
    },
    {
      name: 'Championships',
      description: 'World Championship data'
    },
    {
      name: 'Drivers',
      description: 'Driver information and statistics'
    },
    {
      name: 'Constructors',
      description: 'Constructor/team information'
    }
  ],
  components: {
    schemas: {
      Race: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Unique identifier'
          },
          season: {
            type: 'string',
            description: 'Race season year',
            example: '2024'
          },
          round: {
            type: 'string',
            description: 'Race round number',
            example: '1'
          },
          url: {
            type: 'string',
            description: 'Official race URL'
          },
          raceName: {
            type: 'string',
            description: 'Name of the race',
            example: 'Bahrain Grand Prix'
          },
          Circuit: {
            type: 'object',
            properties: {
              circuitId: {
                type: 'string',
                example: 'bahrain'
              },
              url: {
                type: 'string'
              },
              circuitName: {
                type: 'string',
                example: 'Bahrain International Circuit'
              },
              Location: {
                type: 'object',
                properties: {
                  lat: {
                    type: 'string',
                    example: '26.0325'
                  },
                  long: {
                    type: 'string',
                    example: '50.5106'
                  },
                  locality: {
                    type: 'string',
                    example: 'Sakhir'
                  },
                  country: {
                    type: 'string',
                    example: 'Bahrain'
                  }
                }
              }
            }
          },
          date: {
            type: 'string',
            description: 'Race date',
            example: '2024-03-02'
          },
          time: {
            type: 'string',
            description: 'Race time',
            example: '15:00:00Z'
          },
          Results: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/RaceResult'
            }
          },
          laps: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/LapData'
            }
          },
          pitStops: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/PitStop'
            }
          }
        }
      },
      RaceResult: {
        type: 'object',
        properties: {
          number: {
            type: 'string',
            description: 'Driver number',
            example: '1'
          },
          position: {
            type: 'string',
            description: 'Final position',
            example: '1'
          },
          positionText: {
            type: 'string',
            description: 'Position as text',
            example: '1'
          },
          points: {
            type: 'string',
            description: 'Points awarded',
            example: '25'
          },
          Driver: {
            $ref: '#/components/schemas/Driver'
          },
          Constructor: {
            $ref: '#/components/schemas/Constructor'
          },
          grid: {
            type: 'string',
            description: 'Starting grid position',
            example: '1'
          },
          laps: {
            type: 'string',
            description: 'Number of laps completed',
            example: '57'
          },
          status: {
            type: 'string',
            description: 'Race status',
            example: 'Finished'
          },
          Time: {
            type: 'object',
            properties: {
              millis: {
                type: 'string',
                example: '5434195'
              },
              time: {
                type: 'string',
                example: '1:30:34.195'
              }
            }
          },
          FastestLap: {
            type: 'object',
            properties: {
              rank: {
                type: 'string',
                example: '1'
              },
              lap: {
                type: 'string',
                example: '56'
              },
              Time: {
                type: 'object',
                properties: {
                  time: {
                    type: 'string',
                    example: '1:31.447'
                  }
                }
              },
              AverageSpeed: {
                type: 'object',
                properties: {
                  units: {
                    type: 'string',
                    example: 'kph'
                  },
                  speed: {
                    type: 'string',
                    example: '213.586'
                  }
                }
              }
            }
          }
        }
      },
      LapData: {
        type: 'object',
        properties: {
          number: {
            type: 'string',
            description: 'Lap number',
            example: '1'
          },
          Timings: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                driverId: {
                  type: 'string',
                  example: 'max_verstappen'
                },
                position: {
                  type: 'string',
                  example: '1'
                },
                time: {
                  type: 'string',
                  example: '1:31.523'
                }
              }
            }
          }
        }
      },
      PitStop: {
        type: 'object',
        properties: {
          driverId: {
            type: 'string',
            description: 'Driver identifier',
            example: 'max_verstappen'
          },
          lap: {
            type: 'string',
            description: 'Lap number of pit stop',
            example: '14'
          },
          stop: {
            type: 'string',
            description: 'Pit stop number',
            example: '1'
          },
          time: {
            type: 'string',
            description: 'Time of pit stop',
            example: '13:52:16'
          },
          duration: {
            type: 'string',
            description: 'Duration of pit stop',
            example: '2.506'
          }
        }
      },
      Season: {
        type: 'object',
        properties: {
          season: {
            type: 'string',
            description: 'Season year',
            example: '2024'
          },
          url: {
            type: 'string',
            description: 'Official season URL'
          }
        }
      },
      Championship: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Unique identifier'
          },
          season: {
            type: 'string',
            description: 'Championship season year',
            example: '2024'
          },
          champion: {
            $ref: '#/components/schemas/Driver'
          },
          points: {
            type: 'string',
            description: 'Championship points',
            example: '575'
          },
          wins: {
            type: 'string',
            description: 'Number of wins',
            example: '19'
          },
          constructor: {
            $ref: '#/components/schemas/Constructor'
          },
          constructorPoints: {
            type: 'string',
            description: 'Constructor championship points',
            example: '860'
          }
        }
      },
      Driver: {
        type: 'object',
        properties: {
          driverId: {
            type: 'string',
            description: 'Driver identifier',
            example: 'max_verstappen'
          },
          url: {
            type: 'string',
            description: 'Official driver URL'
          },
          givenName: {
            type: 'string',
            description: 'Driver first name',
            example: 'Max'
          },
          familyName: {
            type: 'string',
            description: 'Driver last name',
            example: 'Verstappen'
          },
          dateOfBirth: {
            type: 'string',
            description: 'Driver birth date',
            example: '1997-09-30'
          },
          nationality: {
            type: 'string',
            description: 'Driver nationality',
            example: 'Dutch'
          },
          code: {
            type: 'string',
            description: 'Driver code',
            example: 'VER'
          },
          permanentNumber: {
            type: 'string',
            description: 'Driver permanent number',
            example: '1'
          }
        }
      },
      Constructor: {
        type: 'object',
        properties: {
          constructorId: {
            type: 'string',
            description: 'Constructor identifier',
            example: 'red_bull'
          },
          url: {
            type: 'string',
            description: 'Official constructor URL'
          },
          name: {
            type: 'string',
            description: 'Constructor name',
            example: 'Red Bull Racing Honda RBPT'
          },
          nationality: {
            type: 'string',
            description: 'Constructor nationality',
            example: 'Austrian'
          }
        }
      }
    },
    responses: {
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Resource not found'
                }
              }
            }
          }
        }
      },
      InternalError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Internal server error'
                }
              }
            }
          }
        }
      }
    }
  }
};

const options = {
  definition: swaggerDefinition,
  apis: [
    './src/controllers/*.ts',
    './src/routes/*.ts'
  ]
};

export default swaggerJSDoc(options); 