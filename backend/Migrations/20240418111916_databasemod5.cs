using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DigitalGamesMarketplace2.Migrations
{
    /// <inheritdoc />
    public partial class databasemod5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Developers",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Developers");
        }
    }
}
