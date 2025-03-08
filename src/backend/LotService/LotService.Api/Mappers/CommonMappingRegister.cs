using LotService.Api.Contracts.Base;
using LotService.Application.Dto;
using Mapster;

namespace LotService.Api.Mappers;

public class CommonMappingRegister: IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig(typeof(IdDto<>), typeof(IdModel<>));
    }
}