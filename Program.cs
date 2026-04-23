using Microsoft.EntityFrameworkCore;
using PcbDefectLogger.Data;
using PcbDefectLogger.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddRazorPages();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Create database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// Configure pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

//app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();
app.MapRazorPages();

app.MapGet("/", () => Results.Redirect("/Index"));

// ✅ Minimal API Endpoints
app.MapPost("/api/defects", async (Defect defect, AppDbContext db) =>
{
    if (defect == null || string.IsNullOrEmpty(defect.LotNumber))
        return Results.BadRequest("Invalid data");

    var exists = await db.Defects
        .AnyAsync(d => d.LotNumber == defect.LotNumber
                    && d.GridX == defect.GridX
                    && d.GridY == defect.GridY);

    if (exists)
        return Results.Conflict("Point already recorded");

    db.Defects.Add(defect);
    await db.SaveChangesAsync();

    return Results.Ok(new { success = true, id = defect.Id });
});

app.MapGet("/api/defects", async (string lot, AppDbContext db) =>
{
    if (string.IsNullOrEmpty(lot))
        return Results.BadRequest("Lot number is required");

    var defects = await db.Defects
        .Where(d => d.LotNumber == lot)
        .Select(d => new { d.GridX, d.GridY, d.DefectType })
        .ToListAsync();

    return Results.Ok(defects);
});

// ✅ API ดึงรายชื่อ Lot ทั้งหมดที่เคยบันทึกไว้
app.MapGet("/api/lots", async (AppDbContext db) =>
{
    var lots = await db.Defects
        .Select(d => d.LotNumber)
        .Distinct()
        .OrderByDescending(l => l) // เรียงจากใหม่ไปเก่า
        .ToListAsync();
    return Results.Ok(lots);
});

// ✅ API สำหรับลบข้อมูล (Reset)
app.MapDelete("/api/defects", async (string lot, AppDbContext db) =>
{
    var defects = db.Defects.Where(d => d.LotNumber == lot);
    if (!defects.Any()) return Results.NotFound();

    db.Defects.RemoveRange(defects);
    await db.SaveChangesAsync();
    return Results.Ok();
});

app.Run();