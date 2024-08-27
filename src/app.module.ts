import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { JwtService } from '@nestjs/jwt';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        playground: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        context: ({ req }) => {
          const jwtService = new JwtService({
            secret: process.env.JWT_SECRET,
          });

          const authHeader = req.headers.authorization;

          if (authHeader) {
            const token = authHeader;
            try {
              const decoded = jwtService.verify(token);
              return { userId: decoded.user.id };
            } catch (err) {
              throw new Error('Token Inválido');
            }
          }
        },
      },
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [{ name: 'users', url: 'http://localhost:3001/graphql' }],
        }),
        buildService: ({ url }) => {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }: any) {
              if (context?.userId)
                request.http.headers.set('user-id', context.userId);
            },
          });
        },
      },
    }),
  ],
})
export class AppModule {}
