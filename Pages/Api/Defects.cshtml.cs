using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PcbDefectLogger.Data;
using PcbDefectLogger.Models;

namespace PcbDefectLogger.Pages.Api;

public class DefectsModel : PageModel
{
    private readonly AppDbContext _db;
    private readonly ILogger<DefectsModel> _logger;

    public DefectsModel(AppDbContext db, ILogger<DefectsModel> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<IActionResult> OnPostAsync([FromBody] Defect defect)
    {
        _logger.LogInformation("Received defect data: {@Defect}", defect);
        
        if (defect == null || string.IsNullOrEmpty(defect.LotNumber)) {
            _logger.LogWarning("Invalid defect data received");
            return BadRequest("Invalid data");
        }

        var exists = await _db.Defects
            .AnyAsync(d => d.LotNumber == defect.LotNumber 
                        && d.GridX == defect.GridX 
                        && d.GridY == defect.GridY);
        
        if (exists) 
            return new ConflictObjectResult("Point already recorded");

        _db.Defects.Add(defect);
        await _db.SaveChangesAsync();
        
        _logger.LogInformation("Defect saved with ID: {Id}", defect.Id);
        return new JsonResult(new { success = true, id = defect.Id });
    }

    public async Task<IActionResult> OnGetAsync(string lot)
    {
        if (string.IsNullOrEmpty(lot))
            return BadRequest("Lot number is required");

        var defects = await _db.Defects
            .Where(d => d.LotNumber == lot)
            .Select(d => new { d.GridX, d.GridY, d.DefectType })
            .ToListAsync();
            
        return new JsonResult(defects);
    }
}