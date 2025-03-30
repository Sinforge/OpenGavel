FROM mcr.microsoft.com/dotnet/runtime:9.0 AS base
USER $APP_UID
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Workers/BlockchainService.TransactionWorker/BlockchainService.TransactionWorker.csproj", "Workers/BlockchainService.TransactionWorker/"]
RUN dotnet restore "Workers/BlockchainService.TransactionWorker/BlockchainService.TransactionWorker.csproj"
COPY . .
WORKDIR "/src/Workers/BlockchainService.TransactionWorker"
RUN dotnet build "BlockchainService.TransactionWorker.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "BlockchainService.TransactionWorker.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BlockchainService.TransactionWorker.dll"]
