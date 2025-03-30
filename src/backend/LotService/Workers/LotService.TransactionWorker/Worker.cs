using System.Text.Json;
using Confluent.Kafka;
using LotService.TransactionWorker.Kafka.Messages;
using LotService.TransactionWorker.Models;
using LotService.TransactionWorker.Repositories;

namespace LotService.TransactionWorker;

internal class Worker : BackgroundService
{
    private readonly IAuctionRepository _auctionRepository;
    private readonly IConsumer<string, string> _consumer;
    private const string TopicName = "completed_transactions";

    public Worker(IAuctionRepository auctionRepository)
    {
        _auctionRepository = auctionRepository;

        var config = new ConsumerConfig
        {
            BootstrapServers = "localhost:9092",
            GroupId = "transaction-consumer-group",
            AutoOffsetReset = AutoOffsetReset.Earliest,
            EnableAutoCommit = false
        };

        _consumer = new ConsumerBuilder<string, string>(config).Build();
        _consumer.Subscribe(TopicName);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var consumeResult = _consumer.Consume(stoppingToken);

                if (consumeResult?.Message != null)
                {
                    Console.WriteLine($"[Kafka] Received transaction: {consumeResult.Message.Value}");

                    var transaction =
                        JsonSerializer.Deserialize<CompletedTransactionMessage>(consumeResult.Message.Value)!;

                    var @params = new PublishAuctionParams(transaction.AuctionId, transaction.ContractAddress);
                    await _auctionRepository.PublishAuctionAsync(@params, stoppingToken);
                    _consumer.Commit(consumeResult);
                }
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Kafka] Error processing message: {ex.Message}");
            }
        }
    }
}