<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [bitburner](./bitburner.md) &gt; [Singularity](./bitburner.singularity.md) &gt; [applyToCompany](./bitburner.singularity.applytocompany.md)

## Singularity.applyToCompany() method

Apply for a job at a company.

**Signature:**

```typescript
applyToCompany(companyName: CompanyName | `${CompanyName}`, field: string): boolean;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  companyName | [CompanyName](./bitburner.companyname.md) \| \`${[CompanyName](./bitburner.companyname.md)<!-- -->}\` | Name of company to apply to. |
|  field | string | Field to which you want to apply. |

**Returns:**

boolean

True if the player successfully get a job/promotion, and false otherwise.

## Remarks

RAM cost: 3 GB \* 16/4/1

This function will automatically try to apply to the specified company for a position in the specified field. This function can also be used to apply for promotions by specifying the company and field you are already employed at.

This function will return true if you successfully get a job/promotion, and false otherwise. Note that if you are trying to use this function to apply for a promotion and you don’t get one, it will return false.

